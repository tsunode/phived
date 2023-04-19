import { HelmetProvider } from "react-helmet-async";
import { Footer, Header, Message, Tasks, Head } from "src/components";

import { useTasksContext } from "src/contexts";

export default function App() {
  const { undoneTask } = useTasksContext();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-lightWhite selection:bg-berryBlue dark:bg-darkerBlack dark:selection:bg-purpleRain">
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <Header />
      <Tasks />
      <Message />
      <Footer />

      <button
        type="button"
        className=" w-36 cursor-pointer items-center justify-center border-l border-b bg-berryBlue text-base dark:bg-purpleRain dark:text-lighterWhite xs:text-lg"
        onClick={undoneTask}
      >
        Desfazer
      </button>
    </div>
  );
}
