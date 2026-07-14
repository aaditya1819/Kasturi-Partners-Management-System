import { NextResponse } from 'next/server';
import { seedDB } from '@/db/seed';

export async function GET() {
  try {
    await seedDB();
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables verified, created, and seeded successfully.' 
    });
  } catch (error) {
    console.error('Setup endpoint failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
