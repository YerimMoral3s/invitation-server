export default {
  routes: [
    {
     method: 'GET',
     path: '/sendInvitation',
     handler: 'confirm.sendInvitation',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'POST',
      path: '/confirmAssistance',
      handler: 'confirm.confirmAssistance',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
