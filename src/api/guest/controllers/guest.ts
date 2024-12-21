/**
 * guest controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::guest.guest",
  ({ strapi }) => ({
    async findWithSubGuests(ctx) {
      try {
        const data = await strapi.db.query("api::guest.guest").findMany({
          populate: ["sub_guests"],
        });

        const formattedData = data.map((guest) => ({
          id: guest.id,
          attributes: {
            phone_number: guest.phone_number,
            name: guest.name,
            createdAt: guest.createdAt,
            updatedAt: guest.updatedAt,
            publishedAt: guest.publishedAt,
            civil_confirmation: guest.civil_confirmation,
            religious_confirmation: guest.religious_confirmation,
            seen: guest.seen,
            blocked: guest.blocked,
            sub_guests: {
              data: guest.sub_guests.map((subGuest) => ({
                id: subGuest.id,
                attributes: {
                  name: subGuest.name,
                  confirmation: subGuest.confirmation,
                  createdAt: subGuest.createdAt,
                  updatedAt: subGuest.updatedAt,
                  publishedAt: subGuest.publishedAt,
                },
              })),
            },
          },
        }));

        ctx.body = { data: formattedData };
      } catch (error) {
        ctx.throw(500, "Error fetching guests with sub-guests");
      }
    },
  })
);
