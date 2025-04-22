import { useCallback, useState } from "react";

interface Event {
  id?: string;
  allDay?: boolean;
  description?: string;
  end?: number;
  start?: number;
  title?: string;
  color?: string;
}

interface DialogDataType extends Event {
  range?: { start: number; end: number };
  eventId?: string;
}

export function useDialog() {
  const [state, setState] = useState<{
    open: boolean;
    data?: DialogDataType | undefined | string;
  }>({
    open: false,
    data: undefined,
  });

  const handleOpen = useCallback(
    (data?: DialogDataType | undefined | string) => {
      setState({
        open: true,
        data,
      });
    },
    []
  );

  console.log(state.open);

  const handleClose = useCallback(() => {
    setState({
      open: false,
    });
  }, []);

  return {
    data: state.data,
    handleClose,
    handleOpen,
    open: state.open,
  };
}
