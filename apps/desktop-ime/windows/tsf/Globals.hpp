#pragma once

#include <windows.h>
#include <msctf.h>

// Global DLL Instance & Reference Count
extern HINSTANCE g_hInst;
extern LONG g_cRefDll;

inline void DllAddRef() {
    InterlockedIncrement(&g_cRefDll);
}

inline void DllRelease() {
    InterlockedDecrement(&g_cRefDll);
}

// {792C6287-E8DF-4CA1-82BB-A9250646BF63}
extern const CLSID CLSID_AmharicTextService;

// {C8894451-9C4E-4FD7-A0E5-0D5460E58552}
extern const GUID GUID_AmharicProfile;

// {98774781-8B0C-4A0B-88FE-98D7C81B8553}
extern const GUID GUID_AmharicDisplayAttribute;

// Language ID: 0x045E = Amharic (Ethiopia), RFC 4646 am-ET
constexpr LANGID AMHARIC_LANGID = 0x045E;

// Text Service Description
constexpr const wchar_t* TEXTSERVICE_DESC = L"Amharic Phonetic Keyboard (Addiyon)";
constexpr const wchar_t* TEXTSERVICE_MODEL = L"Apartment";
