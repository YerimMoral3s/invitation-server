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
  ],
};
