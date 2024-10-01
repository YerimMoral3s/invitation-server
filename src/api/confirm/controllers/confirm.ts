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
  sendOTP: async (ctx, next) => {},
  // this should verify the OTP
  verifyOTP: async (ctx, next) => {},
  // this should confirm the assistance of the user
  confirmAssistance: async (ctx, next) => {
    try {
      // Obtener y validar el cuerpo de la solicitud
      const { id, sub_guests } = ctx.request.body;

      // Validación básica del cuerpo de la solicitud (puedes descomentar las validaciones si lo necesitas)
      if (typeof id !== "number" || !Array.isArray(sub_guests)) {
        ctx.status = 400;
        ctx.body = {
          error: {
            code: 400,
            message: "Bad Request",
            details: [
              {
                field: "body",
                issue: "Invalid request body.",
              },
            ],
          },
        };
        return;
      }

      // Verificar que el `guest` existe
      const user = await strapi.entityService.findOne("api::guest.guest", id, {
        populate: { sub_guests: true },
      });

      if (!user) {
        ctx.status = 404;
        ctx.body = {
          error: {
            code: 404,
            message: "User not found",
            details: [
              {
                field: "id",
                issue: "The specified ID does not exist.",
              },
            ],
          },
        };
        return;
      }

      // Actualizar el estado de confirmación del `guest` y sus `sub_guests`
      if (sub_guests.length > 0) {
        for (const sub_guest of sub_guests) {
          await strapi.entityService.update(
            "api::sub-guest.sub-guest",
            sub_guest.id,
            {
              data: { confirmation: sub_guest.confirmation },
            }
          );
        }
      }

      // Obtener el `guest` actualizado con sus `sub_guests`
      const usr = await strapi.entityService.findOne("api::guest.guest", id, {
        populate: { sub_guests: true },
      });

      const updatedGuests = usr.sub_guests.map((sg) => {
        const id = sg.id;
        delete sg.id;
        return {
          id: id,
          attributes: {
            ...sg,
          },
        };
      });

      delete usr.id;

      const updatedUser = {
        id: user.id,
        attributes: {
          ...usr,
          sub_guests: {
            data: updatedGuests,
          },
        },
      };

      // Responder con el usuario actualizado
      ctx.status = 200;
      ctx.body = { data: updatedUser };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: {
          code: 500,
          message: "Internal Server Error",
          details: [
            {
              issue: error.message,
            },
          ],
        },
      };
    }
  },
};
