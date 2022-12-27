const scrollIntoView = (name: string) => {
  const el = document.querySelector(name);
  el?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

};

export default scrollIntoView;
