package waremaster.waremaster;

import android.content.Context;
import android.content.res.Resources;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static android.provider.Settings.Global.getString;

/**
 * Created by Kreso on 21.1.2018..
 */

public class AddActivityLog {
    public static void Add(final int userId, final int companyId, final String text, final String token, final Context applicationContext)
    {
        StringRequest addLogRequest = new StringRequest(Request.Method.POST, applicationContext.getString(R.string.base_url) + "/activitylogs/add",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String logAdded) {
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String>  authParams = new HashMap<>();

                authParams.put("Authorization", "Bearer " + token);
                return authParams;
            }
            @Override
            public byte[] getBody() throws AuthFailureError {
                JSONObject activityLog = new JSONObject();
                try {
                    activityLog.put("UserId", userId);
                    activityLog.put("CompanyId", companyId);
                    activityLog.put("Text", text);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return activityLog.toString().getBytes();
            }
            @Override
            public String getBodyContentType() {
                return "application/json";
            }
        };
        RequestQueueSingleton.getInstance(applicationContext).addToRequestQueue(addLogRequest);
    }
}
