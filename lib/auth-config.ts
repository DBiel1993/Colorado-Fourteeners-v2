import type { Configuration } from "@azure/msal-browser"

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "",
    authority: `https://${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_NAME}.b2clogin.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_NAME}.onmicrosoft.com/${process.env.NEXT_PUBLIC_AZURE_AD_POLICY_NAME}`,
    knownAuthorities: [`${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_NAME}.b2clogin.com`],
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
}
