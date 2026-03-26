import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/resources",
      permanent: true,
    },
  };
};

export default function ResourcesBlogRedirectPage() {
  return null;
}
