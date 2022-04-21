import { FiEdit2, FiTrash } from "react-icons/fi";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";

interface LocationItemProps {
  onEdit(id: string): void;
  responsible: string;
  companyId: string;
  locationId: string;
  id: string;
  onRemoveResponsible(id: string): void;
}

function ResponsibleItem({
  id,
  responsible,
  locationId,
  companyId,
  onRemoveResponsible,
  onEdit,
}: LocationItemProps) {
  const removeEvent = async () => {
    try {
      const { data } = await api.delete(`/responsaveis/${id}`, {
        headers: { company_id: companyId, location_id: locationId },
      });
      onRemoveResponsible(data);
    } catch (error) {
      console.log(error);
    }
  };

  const editEvent = (e: any) => {
    const { target } = e;
    const { parentElement } = target;
    if (target.type === "button" || parentElement.type === "button") {
      return;
    }
    onEdit(id);
  };

  return (
    <li
      onClick={editEvent}
      style={{ cursor: "pointer" }}
      className={common.item}
    >
      <p>{responsible}</p>
      <FiEdit2 className={common.edit} width={18} />
      <button className={common.buttonRed} onClick={removeEvent} type="button">
        <FiTrash width={18} color="white" />
      </button>
    </li>
  );
}

export { ResponsibleItem };
