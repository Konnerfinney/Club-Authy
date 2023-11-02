export default async function getUserID(){
    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${process.env.DISCORD_ACCESS_TOKEN}`
        }
    })
    const json = await response.json()
    return json.id
}