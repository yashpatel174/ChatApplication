import moment from "moment";

const fileFormat = (url = "") => {
  if (typeof url !== "string") {
    console.error("Expected a string but received:", url);
    return;
  }
  const fileExt = url.split(".").pop();
  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") return "video";
  if (fileExt === "mp3" || fileExt === "wav") return "audio";
  if (fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif") return "image";
  return "file";
};

const transformImage = (url = "", width = 100) => {
  const newUrl = typeof url === "string" ? url.replace("upload/", `upload/dpr_auto/w_${width}/`) : url;
  return newUrl;
};

const getLast7Days = () => {
  const currentDate = moment();
  const last7days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7days.unshift(dayName);
  }
  return last7days;
};

const saveFromStorage = ({ key, value, get }) => {
  if (get) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export { fileFormat, transformImage, getLast7Days, saveFromStorage };
