import _ from "lodash";

import { query } from "../../database";

const updateProfileImage = async (id: number, imageUrl: string) => {
  const text = `
          UPDATE users 
          SET profile_image = $1
          WHERE id = $2
      `;
  const values = [imageUrl, id];
  const result = await query(text, values);
  return result;
};

const updateCoverImage = async (id: number, imageUrl: string) => {
  const text = `
          UPDATE users 
          SET cover_image = $1
          WHERE id = $2
      `;
  const values = [imageUrl, id];
  const result = await query(text, values);
  return result;
};

export { updateCoverImage, updateProfileImage };
