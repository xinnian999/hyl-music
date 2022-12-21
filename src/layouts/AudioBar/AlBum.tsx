import { useRedux } from "@/hooks";
import classnames from "classnames";

export default function AlBum({ className }) {
  const { store } = useRedux();

  const { ing, play } = store;

  return (
    <img
      className={classnames("album", className, {
        "animation-stop": !play,
      })}
      src={
        ing.al?.picUrl ??
        `http://p3.music.126.net/itkdsMFR8nYzaTiDdHO3tA==/${ing.al.pic_str}.jpg`
      }
    />
  );
}
