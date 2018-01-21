package waremaster.waremaster;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.auth0.android.jwt.JWT;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ActivityLogs extends AppCompatActivity {

    private ListView activityLogsList;
    private JWT decoded;
    private String token;
    private int employeeId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_logs);

        activityLogsList = (ListView)findViewById(R.id.activityListView);

        token = getIntent().getStringExtra("waremasterToken");
        decoded = new JWT(token);
        employeeId = Integer.parseInt(decoded.getClaim("id").asString());

        JsonArrayRequest getActivityLogsRequest = new JsonArrayRequest(Request.Method.GET, getString(R.string.base_url) + "/activitylogs/getspecific?employeeId="
                + employeeId, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(final JSONArray activityLogs) {
                        List<String> listContents = new ArrayList<String>(activityLogs.length());
                        for (int i = 0; i < activityLogs.length(); i++)
                        {
                            JSONObject activityLog = activityLogs.optJSONObject(i);
                            listContents.add(activityLog.optString("TimeOfCreation") + " " + activityLog.optString("Text"));
                        }
                        activityLogsList.setAdapter(new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, listContents));
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("Authorization", "Bearer " + token);
                return params;
            }
        };
        RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(getActivityLogsRequest);
    }
}
