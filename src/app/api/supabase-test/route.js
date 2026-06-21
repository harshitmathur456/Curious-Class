import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return Response.json({
        connected: false,
        error: 'Missing environment variables',
        hasUrl: !!url,
        hasKey: !!key,
      }, { status: 500 });
    }

    const supabase = createClient(url, key);

    // Try a simple query — even a "table not found" error confirms the connection
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(0);

    if (error) {
      // These error codes mean the DB connection itself is working fine
      const connectionOkCodes = ['PGRST205', '42P01'];
      const connectionOkMessages = ['does not exist', 'schema cache', 'permission denied'];
      
      const isConnected = connectionOkCodes.includes(error.code) ||
        connectionOkMessages.some(msg => error.message?.includes(msg));

      return Response.json({
        connected: isConnected,
        supabaseUrl: url,
        message: isConnected
          ? '✅ Supabase connection is working! (test table does not exist, which is expected)'
          : `❌ Connection error: ${error.message}`,
        errorCode: error.code,
      }, { status: isConnected ? 200 : 500 });
    }

    return Response.json({
      connected: true,
      supabaseUrl: url,
      message: '✅ Supabase connection is working!',
    });
  } catch (err) {
    return Response.json(
      { connected: false, error: err.message },
      { status: 500 }
    );
  }
}
