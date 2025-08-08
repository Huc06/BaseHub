import { NextRequest, NextResponse } from 'next/server';

// In a real app, you would use a database to store votes
// For demo purposes, we'll use in-memory storage
const votes: Record<string, number> = {
  option1: 15,
  option2: 23,
  option3: 8,
  option4: 12,
};

const userVotes: Record<string, string> = {}; // FID -> optionId

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, option, location } = body;

    if (!fid || !option) {
      return NextResponse.json(
        { error: 'Missing required fields: fid and option' },
        { status: 400 },
      );
    }

    // Check if user has already voted
    if (userVotes[fid]) {
      return NextResponse.json(
        { error: 'User has already voted' },
        { status: 400 },
      );
    }

    // Validate option
    if (!['option1', 'option2', 'option3', 'option4'].includes(option)) {
      return NextResponse.json(
        { error: 'Invalid option' },
        { status: 400 },
      );
    }

    // Record the vote
    votes[option]++;
    userVotes[fid] = option;

    console.log(`Vote recorded: FID ${fid} voted for ${option} from ${location}`);

    return NextResponse.json({
      success: true,
      votes,
      userVote: option,
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    votes,
    totalVotes: Object.values(votes).reduce((sum, count) => sum + count, 0),
  });
} 