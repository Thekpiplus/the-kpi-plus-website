type ReservationScopeIconProps = {
  id: string;
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ReservationScopeIcon({ id, className }: ReservationScopeIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {id === "inquiry" ? (
        <path {...stroke} d="M5 6.5h14v9.5H9.5L5 19.5V6.5Z" />
      ) : null}
      {id === "entry" ? (
        <>
          <path {...stroke} d="M7 4.5h7.5L19 9v10.5H7V4.5Z" />
          <path {...stroke} d="M14.5 4.5V9H19" />
          <path {...stroke} d="M10 13.5h4M12 11.5v4" />
        </>
      ) : null}
      {id === "availability" ? (
        <>
          <path {...stroke} d="M5.5 6.5h13v13h-13v-13Z" />
          <path {...stroke} d="M5.5 10h13M9 4.5v4M15 4.5v4" />
          <path {...stroke} d="M9 15.2 11.1 17l4-4.2" />
        </>
      ) : null}
      {id === "modify" ? (
        <>
          <path {...stroke} d="M4.8 15.7 14.4 6.1l3.5 3.5-9.6 9.6H4.8v-3.5Z" />
          <path {...stroke} d="M12.8 7.7l3.5 3.5" />
        </>
      ) : null}
      {id === "cancel" ? (
        <>
          <path {...stroke} d="M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z" />
          <path {...stroke} d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
        </>
      ) : null}
      {id === "confirm" ? (
        <>
          <path {...stroke} d="M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z" />
          <path {...stroke} d="m8.6 12.2 2.3 2.3 4.5-4.8" />
        </>
      ) : null}
      {id === "channel" ? (
        <>
          <path {...stroke} d="M7 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
          <path {...stroke} d="M17 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
          <path {...stroke} d="M12 20.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
          <path {...stroke} d="M8.5 8.4 11 15.6M15.5 8.4 13 15.6M9.2 6h5.6" />
        </>
      ) : null}
      {id === "report" ? (
        <>
          <path {...stroke} d="M5 19.5h14" />
          <path {...stroke} d="M7.5 19.5V12M12 19.5V7.5M16.5 19.5v-8" />
        </>
      ) : null}
    </svg>
  );
}
