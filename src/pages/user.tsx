import Head from "next/head"

import Menu from "src/components/menu";

const User = () => {
  return (
    <Menu>
      <Head>
        <title>User</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="title-page">User</h1>
      </div>
    </Menu>
  );
};

export default User;
