const httpTohttps = (url: string) => {
  let https: any = url.split("");
  https.splice(4, 0, "s");
  https = https.join("");

  return https;
};

export default httpTohttps;
