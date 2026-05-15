import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { dartCode, projectId } = await request.json();
    
    // Make sure your PAT is still in your .env.local file!
    const GITHUB_PAT = process.env.GITHUB_PAT;
    
    // UPDATED WITH YOUR EXACT GITHUB DETAILS
    const githubUsername = process.env.GITHUB_USERNAME;
    const repoName = process.env.GITHUB_REPO_NAME;

    if (!GITHUB_PAT) {
       return NextResponse.json({ error: "Server configuration missing (GitHub token)" }, { status: 500 });
    }

    // Call the GitHub API to trigger the workflow dispatch
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${GITHUB_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'trigger-build',
        client_payload: {
          project_id: projectId,
          main_dart: dartCode
        }
      })
    });

    if (!response.ok) {
       const errText = await response.text();
       throw new Error(`GitHub API Error: ${response.status} ${errText}`);
    }

    // Success! Tell the frontend the build has started.
    return NextResponse.json({ 
      status: "building", 
      message: "Cloud build started! Your APK is compiling on our servers." 
    }, { status: 200 });

  } catch (error) {
    console.error("Cloud Build Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}