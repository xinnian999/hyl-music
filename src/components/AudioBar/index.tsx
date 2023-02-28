import { useBoolean, useMount, useRedux } from "@/hooks";
import { getArtist } from "@/utils";
import Player from "./Player";
import PlayBtn from "./PlayBtn";
import AlBum from "./AlBum";
import "./index.less";
import { url } from "hyl-utils";

export default function AudioBar() {
  const [visible, on, off] = useBoolean(false);

  const { store, dispatch } = useRedux();

  const { ing, audio } = store;

  useMount(() => {
    dispatch({ type: "CHANGE_AUDIO", payload: new Audio() });
    const { audioVisible } = url.getParams();
    if (audioVisible) on();
  });

  if (!ing.name) return null;

  return (
    <>
      <div className="audioBar" onClick={on}>
        <AlBum className="audioBar-avatar" />
        <div className="info">
          <span>{ing.name}</span> - <span>{getArtist(ing.ar)}</span>
        </div>
        <PlayBtn className="audioBar-playBtn" />
      </div>

      {audio.tagName && <Player onBack={off} visible={visible} />}
    </>
  );
}
