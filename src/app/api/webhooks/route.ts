import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db/neon'
import { users } from '@/db/schema'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // // Do something with payload
  // // For this guide, log payload to console
  // const { id } = evt.data
  // const eventType = evt.type
  // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  // console.log('Webhook payload:', body)

  if(evt.type === 'user.created') {
    const { id, email_addresses, username, image_url } = evt.data

    if(!email_addresses || email_addresses.length === 0) {
      return new Response('Error: User must have an email address', {
        status: 400,
      })
    }

    const email = email_addresses[0].email_address

    if(!id || !email || !username || !image_url) {
      return new Response('Error: Missing required user data', {
        status: 400,
      });
    }
    

    try {
      const newUser = await db.insert(users).values({
        email: email,
        name: username || "Anonymous User",
        imageUrl: image_url || '',
        clerkUserId: id
      });
      return new Response(JSON.stringify(newUser), {
        status: 201,
      })
    } catch(error) {
      console.error('Error: Failed to store event in the database:', error)
      return new Response('Error: Failed to store event in the database', {
        status: 500,
      });
    }
  }

  return new Response('Webhook received', { status: 200 })
}