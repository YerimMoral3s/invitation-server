/**
 * A set of functions called "actions" for `confirm`
 */

import { ApiGuestGuest } from "../../../../types/generated/contentTypes";

export default {
    // this should send a message to all the guests with the invitation
    sendInvitation: async (ctx, next) => {},
    // this should send an OTP to the user
    sendOTP:async (ctx, next) => {},
    // this should verify the OTP
    verifyOTP:async (ctx, next) => {},
    // this should confirm the assistance of the user
    confirmAssistance:async (ctx, next) => {
      try {
        const body: { id: number, confirmation: boolean } = ctx.request.body;

        if (typeof body.id !== 'number' || typeof body.confirmation !== 'boolean') {
          ctx.status = 400;
          ctx.body = {
            error: {
              code: 400,
              message: "Bad Request",
              details: [
                {
                  field: "body",
                  issue: "error in the body of the request."
                }
              ]
            }
          };
          return;
        }

        const user = await strapi.entityService.findOne("api::guest.guest", body.id) as unknown as ApiGuestGuest["attributes"];

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
          data: {
            confirmation: body.confirmation
          }
        });

        ctx.status = 200;
        ctx.body = {
          data: {
            ...user,
            confirmation: body.confirmation
          }
        };
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
