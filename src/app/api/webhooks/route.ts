import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db/neon'
import { users } from '@/db/schema'

export async function POST(req: Request) {
  console.log('Webhook endpoint received a request')
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    console.error('Missing SIGNING_SECRET environment variable')
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
    console.error('Missing Svix headers:', { svix_id, svix_timestamp, svix_signature: !!svix_signature })
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
    console.log('Webhook verified successfully, event type:', evt.type)
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  if(evt.type === 'user.created') {
    console.log('Processing user.created event', evt.data)
    const { id, email_addresses, username, image_url } = evt.data

    if(!email_addresses || email_addresses.length === 0) {
      console.error('User has no email addresses')
      return new Response('Error: User must have an email address', {
        status: 400,
      })
    }

    const email = email_addresses[0].email_address

    if(!id || !email || !username || !image_url) {
      console.error('Missing required user data:', { id, email, username, image_url })
      return new Response('Error: Missing required user data', {
        status: 400,
      });
    }
    
  
    try {
      const newUser = await db.insert(users).values({
        email: email,
        name: username || "Anonymous User",
        imageUrl: image_url || '',
        clerkUserId: id,
        role: 'user'
      }).returning();
      
      console.log('User created successfully in database:', newUser)
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