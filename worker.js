export default async function fetch(request, env, ctx) {
  // Reemplaza esta URL por tu deploy hook real
  const DEPLOY_HOOK_URL = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hook_id';

  // Realiza la petición POST al deploy hook
  const response = await fetch(DEPLOY_HOOK_URL, {
    method: 'POST'
  });

  if (response.ok) {
    return new Response('Deploy iniciado correctamente.', { status: 200 });
  } else {
    return new Response('Error al iniciar el deploy.', { status: 500 });
  }
}