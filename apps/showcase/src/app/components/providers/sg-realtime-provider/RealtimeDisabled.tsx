import { SgRealtimeProvider, useSgRealtimeStatus } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../../i18n";

function StatusText() {
  const i18n = useShowcaseI18n();
  return <span>{t(i18n, "showcase.component.realtimeProvider.labels.state", { status: useSgRealtimeStatus().status })}</span>;
}

export default function Example() {
  return (
    <SgRealtimeProvider channels={["backup"]} enabled={false}>
      <StatusText />
    </SgRealtimeProvider>
  );
}
