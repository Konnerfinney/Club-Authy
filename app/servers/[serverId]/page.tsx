// app/servers/[serverId].tsx

// If you are fetching data from an external API or database, implement this function
async function fetchServerData(serverId) {
    const response = await fetch(`http://your-api-endpoint/servers/${serverId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch server data for ID ${serverId}`);
    }
    return response.json();
  }
  
  export async function loader({ params }) {
    const { serverId } = params;
    const serverData = await fetchServerData(serverId);
    return { props: { serverId } };
  }
  
  export default function Page({ params }) {
    return (
      <div>
        <h1>Server Number: {params.serverId}</h1>
        {/* Render additional components or data using serverData */}
      </div>
    );
  }
  