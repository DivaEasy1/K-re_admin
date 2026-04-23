import { Activity, Gauge, MapPinned, MessageSquareMore, Settings2 } from "lucide-react";

export const navigationItems = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: Gauge
  },
  {
    title: "Stations",
    href: "/stations",
    icon: MapPinned
  },
  {
    title: "Activites",
    href: "/activities",
    icon: Activity
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquareMore
  },
  {
    title: "Parametres",
    href: "/settings",
    icon: Settings2
  }
] as const;

export function getPageTitle(pathname: string) {
  if (pathname === "/") {
    return {
      title: "Vue d'ensemble",
      description: "Suivez les stations, les activites et les demandes clients depuis un seul endroit."
    };
  }

  if (pathname.startsWith("/stations/new")) {
    return {
      title: "Nouvelle station",
      description: "Creez une nouvelle station avec ses equipements, sa position et ses informations d'ouverture."
    };
  }

  if (pathname.startsWith("/stations/")) {
    return {
      title: "Modifier la station",
      description: "Mettez a jour les informations d'exploitation, les medias et le statut."
    };
  }

  if (pathname.startsWith("/stations")) {
    return {
      title: "Stations",
      description: "Gerez les points de depart K-Re, leur disponibilite et leur calendrier d'ouverture."
    };
  }

  if (pathname.startsWith("/activities/new")) {
    return {
      title: "Nouvelle activite",
      description: "Ajoutez une nouvelle experience et preparez sa publication."
    };
  }

  if (pathname.startsWith("/activities/")) {
    return {
      title: "Modifier l'activite",
      description: "Ajustez les details, le tarif et la presentation de l'activite."
    };
  }

  if (pathname.startsWith("/activities")) {
    return {
      title: "Activites",
      description: "Organisez les experiences, les tarifs et les categories."
    };
  }

  if (pathname.startsWith("/messages/")) {
    return {
      title: "Message client",
      description: "Consultez la demande et traitez-la rapidement."
    };
  }

  if (pathname.startsWith("/messages")) {
    return {
      title: "Messages",
      description: "Suivez les nouvelles demandes, les reponses et les conversations archivees."
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      title: "Parametres",
      description: "Gerez l'acces admin, les canaux de contact et l'historique recent."
    };
  }

  return {
    title: "K-Re Admin",
    description: "Centre de pilotage de l'equipe d'administration."
  };
}
