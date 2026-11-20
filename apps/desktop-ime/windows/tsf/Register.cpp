#include "Register.hpp"
#include "Globals.hpp"
#include <msctf.h>
#include <strsafe.h>

static const WCHAR c_szInfoKeyPrefix[] = L"CLSID\\";
static const WCHAR c_szInProcSvr32[] = L"InprocServer32";
static const WCHAR c_szModelName[] = L"ThreadingModel";

static BOOL CLSIDToString(REFGUID refGUID, WCHAR* psz) {
    return StringFromGUID2(refGUID, psz, 64) > 0;
}

static BOOL RegisterServerKey(REFGUID clsid, const WCHAR* pszDesc) {
    WCHAR szCLSID[64];
    if (!CLSIDToString(clsid, szCLSID)) return FALSE;

    WCHAR szKey[128];
    StringCchPrintfW(szKey, ARRAYSIZE(szKey), L"%s%s", c_szInfoKeyPrefix, szCLSID);

    HKEY hKey = nullptr;
    if (RegCreateKeyExW(HKEY_CLASSES_ROOT, szKey, 0, nullptr, REG_OPTION_NON_VOLATILE, KEY_WRITE, nullptr, &hKey, nullptr) != ERROR_SUCCESS) {
        return FALSE;
    }

    RegSetValueExW(hKey, nullptr, 0, REG_SZ, (const BYTE*)pszDesc, (DWORD)(wcslen(pszDesc) + 1) * sizeof(WCHAR));

    HKEY hSubKey = nullptr;
    if (RegCreateKeyExW(hKey, c_szInProcSvr32, 0, nullptr, REG_OPTION_NON_VOLATILE, KEY_WRITE, nullptr, &hSubKey, nullptr) == ERROR_SUCCESS) {
        WCHAR szFilePath[MAX_PATH];
        GetModuleFileNameW(g_hInst, szFilePath, ARRAYSIZE(szFilePath));

        RegSetValueExW(hSubKey, nullptr, 0, REG_SZ, (const BYTE*)szFilePath, (DWORD)(wcslen(szFilePath) + 1) * sizeof(WCHAR));
        RegSetValueExW(hSubKey, c_szModelName, 0, REG_SZ, (const BYTE*)TEXTSERVICE_MODEL, (DWORD)(wcslen(TEXTSERVICE_MODEL) + 1) * sizeof(WCHAR));
        RegCloseKey(hSubKey);
    }

    RegCloseKey(hKey);
    return TRUE;
}

static BOOL UnregisterServerKey(REFGUID clsid) {
    WCHAR szCLSID[64];
    if (!CLSIDToString(clsid, szCLSID)) return FALSE;

    WCHAR szKey[128];
    StringCchPrintfW(szKey, ARRAYSIZE(szKey), L"%s%s\\%s", c_szInfoKeyPrefix, szCLSID, c_szInProcSvr32);
    RegDeleteKeyW(HKEY_CLASSES_ROOT, szKey);

    StringCchPrintfW(szKey, ARRAYSIZE(szKey), L"%s%s", c_szInfoKeyPrefix, szCLSID);
    RegDeleteKeyW(HKEY_CLASSES_ROOT, szKey);

    return TRUE;
}

HRESULT RegisterProfiles() {
    ITfInputProcessorProfiles* pProfiles = nullptr;
    HRESULT hr = CoCreateInstance(CLSID_TF_InputProcessorProfiles, nullptr, CLSCTX_INPROC_SERVER,
                                  IID_ITfInputProcessorProfiles, (void**)&pProfiles);
    if (FAILED(hr)) return hr;

    hr = pProfiles->Register(CLSID_AmharicTextService);
    if (SUCCEEDED(hr)) {
        WCHAR szFilePath[MAX_PATH];
        GetModuleFileNameW(g_hInst, szFilePath, ARRAYSIZE(szFilePath));

        hr = pProfiles->AddLanguageProfile(
            CLSID_AmharicTextService,
            AMHARIC_LANGID,
            GUID_AmharicProfile,
            TEXTSERVICE_DESC,
            (ULONG)wcslen(TEXTSERVICE_DESC),
            szFilePath,
            (ULONG)wcslen(szFilePath),
            0
        );

        pProfiles->EnableLanguageProfile(CLSID_AmharicTextService, AMHARIC_LANGID, GUID_AmharicProfile, TRUE);
    }

    pProfiles->Release();
    return hr;
}

HRESULT UnregisterProfiles() {
    ITfInputProcessorProfiles* pProfiles = nullptr;
    HRESULT hr = CoCreateInstance(CLSID_TF_InputProcessorProfiles, nullptr, CLSCTX_INPROC_SERVER,
                                  IID_ITfInputProcessorProfiles, (void**)&pProfiles);
    if (FAILED(hr)) return hr;

    pProfiles->Unregister(CLSID_AmharicTextService);
    pProfiles->Release();
    return S_OK;
}

static const GUID* const c_pCategories[] = {
    &GUID_TFCAT_TIP_KEYBOARD,
    &GUID_TFCAT_TIPCAP_UIELEMENTENABLED,
    &GUID_TFCAT_TIPCAP_IMMERSIVESUPPORT,
    &GUID_TFCAT_TIPCAP_SYSTRAYSUPPORT
};

HRESULT RegisterCategories() {
    ITfCategoryMgr* pCatMgr = nullptr;
    HRESULT hr = CoCreateInstance(CLSID_TF_CategoryMgr, nullptr, CLSCTX_INPROC_SERVER,
                                  IID_ITfCategoryMgr, (void**)&pCatMgr);
    if (FAILED(hr)) return hr;

    for (const GUID* pCat : c_pCategories) {
        hr = pCatMgr->RegisterCategory(CLSID_AmharicTextService, *pCat, CLSID_AmharicTextService);
        if (FAILED(hr)) break;
    }

    pCatMgr->Release();
    return hr;
}

HRESULT UnregisterCategories() {
    ITfCategoryMgr* pCatMgr = nullptr;
    HRESULT hr = CoCreateInstance(CLSID_TF_CategoryMgr, nullptr, CLSCTX_INPROC_SERVER,
                                  IID_ITfCategoryMgr, (void**)&pCatMgr);
    if (FAILED(hr)) return hr;

    for (const GUID* pCat : c_pCategories) {
        pCatMgr->UnregisterCategory(CLSID_AmharicTextService, *pCat, CLSID_AmharicTextService);
    }

    pCatMgr->Release();
    return S_OK;
}

HRESULT RegisterServer() {
    if (!RegisterServerKey(CLSID_AmharicTextService, TEXTSERVICE_DESC)) {
        return E_FAIL;
    }

    HRESULT hr = RegisterProfiles();
    if (FAILED(hr)) {
        UnregisterServerKey(CLSID_AmharicTextService);
        return hr;
    }

    hr = RegisterCategories();
    if (FAILED(hr)) {
        UnregisterProfiles();
        UnregisterServerKey(CLSID_AmharicTextService);
        return hr;
    }

    return S_OK;
}

HRESULT UnregisterServer() {
    UnregisterCategories();
    UnregisterProfiles();
    UnregisterServerKey(CLSID_AmharicTextService);
    return S_OK;
}
