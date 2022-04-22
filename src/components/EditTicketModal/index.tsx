import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FieldError } from "react-hook-form";
import Modal from "react-modal";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { Input } from "../Input";
import styles from "./EditTicketModal.module.scss";

type Ticket = {
  id: string;
  status: string;
  will_solve: string;
  locationId: string;
  companyId: string;
};

interface EditTicketModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onRequestClose(): void;
  updateTickets(): Promise<void>;
}

export function EditTicketModal({
  isOpen,
  onRequestClose,
  ticket,
  updateTickets,
}: EditTicketModalProps) {
  const [willSolve, setWillSolve] = useState(ticket.will_solve);
  const [status, setStatus] = useState(ticket.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<FieldError>({ type: "", message: "" });

  useEffect(() => {
    setStatus(ticket.status);
    setWillSolve(ticket.will_solve);
  }, [ticket]);

  const onChangeService = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length < 5)
      setError({
        type: "minLength",
        message: "Nome deve ter pelo menos 5 caracteries.",
      });
    else {
      setError({ type: "", message: "" });
    }
    setWillSolve(value);
  };

  const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setStatus(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error.type) return;
    setIsSubmitting(true);
    await api.put(
      `/tickets/${ticket?.id}`,
      { will_solve: willSolve, status },
      {
        headers: {
          location_id: ticket.locationId,
          company_id: ticket.companyId,
        },
      }
    );
    await updateTickets();
    setIsSubmitting(false);
    onRequestClose();
  };

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.4)" } }}
    >
      <button
        className={styles.closeBtn}
        onClick={onRequestClose}
        type="button"
      >
        x
      </button>
      <form className={styles.container} onSubmit={onSubmit}>
        <Input
          error={error}
          label="Quem resolverá o ticket"
          type="text"
          value={willSolve}
          name="service"
          onChange={onChangeService}
        />
        <p>Status</p>
        <div>
          <label htmlFor="pendente">
            <input
              id="pendente"
              type="radio"
              name="status"
              value="pendente"
              onChange={onChangeStatus}
              checked={status === "pendente"}
            />
            Pendente
          </label>
          <label htmlFor="progresso">
            <input
              id="progresso"
              type="radio"
              name="status"
              value="progresso"
              onChange={onChangeStatus}
              checked={status === "progresso"}
            />
            Progresso
          </label>
          <label htmlFor="concluido">
            <input
              id="concluido"
              type="radio"
              name="status"
              value="concluido"
              onChange={onChangeStatus}
              checked={status === "concluido"}
            />
            Concluído
          </label>
        </div>
        <button className={common.button} type="submit">
          {isSubmitting ? "Editando..." : "Editar"}
        </button>
      </form>
    </Modal>
  );
}
