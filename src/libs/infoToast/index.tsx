import toast, { Renderable } from "react-hot-toast";
import { FcInfo } from "react-icons/fc";

// TODO: 本当は toast.custom で呼び出したい
function infoToast(message: Renderable): string {
  return toast(message, {
    icon: <FcInfo size={22} />,
  });
}

export default infoToast;
