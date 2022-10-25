import Menu from "src/components/menu";
import Head from "next/head";

const ViewClients = () => {
  return (
    <Menu>
      <Head>
        <title>View Clients</title>
      </Head>
      <div className="container mx-auto flex flex-col gap-4">
        <h1 className="title-page">View Clients</h1>
      </div>
    </Menu>
  );
};

export default ViewClients;
