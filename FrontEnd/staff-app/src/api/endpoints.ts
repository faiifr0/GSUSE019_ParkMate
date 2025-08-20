const endpoints = {
  auth: {
    login: "/users/login",
    register: "/users/register",
    profile: (id: number) => `/users/${id}`,
  },
  wallet: {
    list: "/wallets",
    detail: (id: number) => `/wallets/${id}`,
  },
  transaction: {
    list: "/transactions",
    detail: (id: number) => `/transactions/${id}`,
  },
  staff: {
    list: "/staff-assignments",
  },
  shift: {
    list: "/shift",
    detail: (id: number) => `/shift/${id}`,
  },
  branch: {
    list: "/park-branch",
    detail: (id: number) => `/park-branch/${id}`,
  },
  notification: {
    list: "/notification",
    detail: (id: number) => `/notification/${id}`,
  },
};

export default endpoints;
