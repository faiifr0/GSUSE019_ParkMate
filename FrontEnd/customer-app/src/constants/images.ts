// src/constants/images.ts
const CLOUDINARY_BASE = "https://res.cloudinary.com/dxe4g2oyc/image/upload/v1758727470";

export const images = {
  logo: `${CLOUDINARY_BASE}/logo.png`,
  loginBg: `${CLOUDINARY_BASE}/bg_login.jpg`,
  banner: `${CLOUDINARY_BASE}/banner.jpg`,
  avatarDefault: `${CLOUDINARY_BASE}/avatar.png`,

  loginSlides: [
    `${CLOUDINARY_BASE}/slide1.jpg`,
    `${CLOUDINARY_BASE}/slide2.jpg`,
    `${CLOUDINARY_BASE}/slide3.jpg`,
    `${CLOUDINARY_BASE}/slide4.jpg`,
  ],
};