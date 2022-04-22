import { FiEdit2, FiTrash } from "react-icons/fi";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";

interface TicketItemProps {
  title: string;
  id: string;
  companyId: string;
  locationId: string;
  onModalOpen(id: string): void;
  updateTickets(): Promise<void>;
}

export function TicketItem({
  title,
  id,
  onModalOpen,
  companyId,
  locationId,
  updateTickets,
}: TicketItemProps) {
  const editEvent = (e: any) => {
    const { target } = e;
    const { parentElement } = target;
    if (target.type === "button" || parentElement.type === "button") {
      return;
    }
    onModalOpen(id);
  };

  const removeEvent = async () => {
    await api.delete(`tickets/${id}`, {
      headers: {
        company_id: companyId,
        location_id: locationId,
      },
    });
    await updateTickets();
  };

  return (
    <li
      onClick={editEvent}
      style={{ cursor: "pointer" }}
      className={common.item}
    >
      <p>{title}</p>
      <FiEdit2 className={common.edit} width={18} />
      <button className={common.buttonRed} onClick={removeEvent} type="button">
        <FiTrash width={18} color="white" />
      </button>
    </li>
  );
}
