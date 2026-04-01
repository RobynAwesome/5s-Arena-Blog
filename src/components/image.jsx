import { IKImage } from "@imagekit/react";

const Image = ({ src, className, w, h, alt }) => {
  const endpoint = import.meta.env.VITE_IK_URL_ENDPOINT;

  if (!endpoint) {
    return (
      <img
        src={src.startsWith("/") ? src : `/${src}`}
        className={className}
        loading="lazy"
        alt={alt}
        width={w}
        height={h}
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={endpoint}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = src.startsWith("/") ? src : `/${src}`;
      }}
    />
  );
};

export default Image;
