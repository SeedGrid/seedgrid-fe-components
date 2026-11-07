import { SgRealtimeProvider, useSgRealtimeStatus } from "@seedgrid/fe-components";

function StatusText() {
  return <span>Estado: {useSgRealtimeStatus().status}</span>;
}

export default function Example() {
  return (
    <SgRealtimeProvider channels={["backup"]} enabled={false}>
      <StatusText />
    </SgRealtimeProvider>
  );
}
