package waremaster.waremaster;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LogIn extends AppCompatActivity {
    private TextView firstName, lastName;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log_in);

        firstName = (TextView)findViewById(R.id.firstNameView);
        lastName = (TextView)findViewById(R.id.lastNameView);



// Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url ="http://waremaster.azurewebsites.net/api/employees/edit?id=2";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject employee) {
                        firstName.setText(employee.optString("FirstName"));
                        lastName.setText(employee.optString("LastName"));
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                firstName.setText(error.toString());
            }
        })
        {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjY0NzQ4IiwiYXVkIjoid2FyZW1hc3RlcmF1ZGllbmNlIiwiZXhwIjoiMTUxNTUzMzU2OCIsImlkIjoiMSIsImNvbXBhbnlpZCI6IjEiLCJjb21wYW55bmFtZSI6IlBydmEgT25saW5lIiwidXNlcm5hbWUiOiJrb29sY3Jhc2giLCJmaXJzdG5hbWUiOiJLcmXFoWltaXIiLCJsYXN0bmFtZSI6IsSMb25kacSHIn0.ppUvJf0q75fUr2KHzoLVz_xkdMSXA37H0jY1K1rhK-w");
                return params;
            }
        };
// Add the request to the RequestQueue.
        queue.add(jsonObjectRequest);

    }
}
