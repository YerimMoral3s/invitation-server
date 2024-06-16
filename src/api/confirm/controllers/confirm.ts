/**
 * A set of functions called "actions" for `confirm`
 */

import { ApiGuestGuest } from "../../../../types/generated/contentTypes";




export default {
  // this should send a message to all the guests with the invitation
  sendInvitation: async (ctx, next) => {
    // try {

    //   const guests = await strapi.entityService.findMany("api::guest.guest") as unknown as ApiGuestGuest["attributes"][];


    //   const client = require('twilio')(accountSid, authToken);

    //   client.messages
    //   .create({
    //     body: 'https://yerimmoral3s.github.io/Inivitacion/',
    //     from: 'whatsapp:+14155238886',
    //     to: 'whatsapp:+5215530589089'
    //   })
    //   .then(message => console.log(message.sid))





    //  // guests.forEach(async (guest) => {
    //  //   console.log(guest.name);


    //  //   guest.phone_number = guest.phone_number.replace(/\D/g, '');

    //  //   console.log(guest.phone_number);

    //  //   console.log({
    //  //     from: `${number}`,
    //  //     body: 'Me la pelas',
    //  //     to: `+52${guest.phone_number}`
    //  //   });



    //  //   });



    // } catch (err) {
    //   ctx.body = err;
    // }

  },
  // this should send an OTP to the user
  sendOTP:async (ctx, next) => {},
  // this should verify the OTP
  verifyOTP:async (ctx, next) => {},
  // this should confirm the assistance of the user
  confirmAssistance:async (ctx, next) => {
    try {
      const body: {
        id: number;
        confirmation: boolean;
        sub_guests: { id: number; confirmation: boolean }[];
      } = ctx.request.body;

      const validateBody = (body: any): boolean => {
        if (typeof body.id !== 'number' || typeof body.confirmation !== 'boolean') {
          return false;
        }
        if (!Array.isArray(body.sub_guests)) {
          return false;
        }
        for (const sub_guest of body.sub_guests) {
          if (typeof sub_guest.id !== 'number' || typeof sub_guest.confirmation !== 'boolean') {
            return false;
          }
        }
        return true;
      };

      if (!validateBody(body)) {
        ctx.status = 400;
        ctx.body = {
          error: {
            code: 400,
            message: "Bad Request",
            details: [
              {
                field: "body",
                issue: "Error in the body of the request."
              }
            ]
          }
        };
        return;
      }

      const user = await strapi.entityService.findOne("api::guest.guest", body.id, {
        populate: { sub_guests: true }
      }) as unknown as ApiGuestGuest["attributes"];

      if (!user) {
        ctx.status = 404;
        ctx.body = {
          error: {
            code: 404,
            message: "User not found",
            details: [
              {
                field: "id",
                issue: "The specified ID does not exist."
              }
            ]
          }
        };
        return;
      }

      await strapi.entityService.update("api::guest.guest", body.id, {
        data: { confirmation: body.confirmation }
      });

      if (body.sub_guests && body.sub_guests.length > 0) {
        for (const sub_guest of body.sub_guests) {
          await strapi.entityService.update("api::sub-guest.sub-guest", sub_guest.id, {
            data: { confirmation: sub_guest.confirmation }
          });
        }
      }

      const newUser = await strapi.entityService.findOne("api::guest.guest", body.id, {
        populate: { sub_guests: true }
      }) as unknown as ApiGuestGuest["attributes"];

      ctx.status = 200;
      ctx.body = { data: newUser };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: {
          code: 500,
          message: "Internal server error",
          details: [
            {
              field: "error",
              issue: "An error occurred while trying to update the user.",
              error: error.message
            }
          ]
        }
      };
    }
  }
};
