import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import ReactModal from "react-modal";

import { EditTicketModal } from "../../components/EditTicketModal";
import { Header } from "../../components/Header";
import { TicketItem } from "../../components/TicketItem";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { getCompanyId } from "../../utils/CompanyCookies";
import { withSSRAuth } from "../../utils/withSSRAuth";
import styles from "./Tickets.module.scss";

type Ticket = {
  id: string;
  title: string;
  status: string;
  will_solve: string;
  locationId: string;
  companyId: string;
};

interface TicketsProps {
  company: {
    name: string;
    id: string;
  };
  tickets: Ticket[];
}

ReactModal.setAppElement("#__next");

export default function Tickets({ tickets, company }: TicketsProps) {
  const [ticketsList, setTicketsList] = useState<Ticket[]>(tickets);
  const [currentTicket, setCurrentTicket] = useState<Ticket>(ticketsList[0]);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const onModalClose = () => {
    setIsEditTicketModalOpen(false);
  };

  const onModalOpen = (id: string) => {
    const ticket = ticketsList.find((ticket) => ticket.id === id);
    if (ticket) setCurrentTicket(ticket);
    setIsEditTicketModalOpen(true);
  };

  const updateTickets = async () => {
    const { data } = await api.get("/tickets", {
      headers: { company_id: company.id },
    });
    setTicketsList(data);
  };

  return (
    <>
      <Head>
        <title>{company.name} | Tickets</title>
      </Head>
      <Header name={user?.name} hasNavLink />
      <main className={styles.container}>
        <h3 className={styles["main-header"]}>
          Tickets da empresa {company.name}
        </h3>

        <EditTicketModal
          isOpen={isEditTicketModalOpen}
          onRequestClose={onModalClose}
          ticket={currentTicket}
          updateTickets={updateTickets}
        />
        <ul className={common.list}>
          {ticketsList.map((ticket) => (
            <TicketItem
              key={ticket.id}
              title={ticket.title}
              onModalOpen={onModalOpen}
              companyId={company.id}
              locationId={ticket.locationId}
              id={ticket.id}
              updateTickets={updateTickets}
            />
          ))}
        </ul>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    const companyId = getCompanyId(context);
    if (!companyId) {
      return {
        props: {
          tickets: [],
          company: { id: "", name: "" },
        },
        redirect: {
          destination: "/empresas",
          permanent: false,
        },
      };
    }

    const api = setupAPIClient(context);
    const { data: company } = await api.get(`/empresas/${companyId}`);
    const { data: tickets } = await api.get("/tickets", {
      headers: { company_id: companyId },
    });
    return {
      props: {
        tickets,
        company: {
          id: companyId,
          name: company.name,
        },
      },
    };
  }
);
