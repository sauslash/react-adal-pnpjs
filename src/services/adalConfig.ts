import { AdalConfig, AuthenticationContext, adalGetToken } from "react-adal";

// Endpoint URL
export const endpoint = "https://solucoessa.sharepoint.com";

// App Registration ID
const appId = "f2eda5bf-80c4-42bf-b3a7-fdea4e220352";

export const adalConfig: AdalConfig = {
  cacheLocation: "localStorage",
  clientId: appId,
  endpoints: {
    api: endpoint,
  },
  postLogoutRedirectUri: window.location.origin,
  tenant: "solucoessa.onmicrosoft.com",
};

class AdalContext {
  private authContext: AuthenticationContext;
  
  constructor() {
      this.authContext = new AuthenticationContext(adalConfig);
  }

  get AuthContext() {
      return this.authContext;
  }

  public GetToken(): Promise<string | null> {
      return adalGetToken(this.authContext, endpoint);
  }

  public LogOut() {
      this.authContext.logOut();
  }
}

const adalContext: AdalContext = new AdalContext();
export default adalContext;

