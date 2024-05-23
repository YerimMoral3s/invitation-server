/**
 * A set of functions called "actions" for `confirm`
 */

export default {
  sendInvitation: async (ctx, next) => {
    try {
      ctx.body = 'ok';
      console.log('confirm.exampleAction');
    } catch (err) {
      ctx.body = err;
    }
  }
};
