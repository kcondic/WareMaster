package waremaster.waremaster;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LogIn extends AppCompatActivity {
    private EditText usernameInput, passwordInput;
    private TextView register;
    private Button login;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log_in);

        usernameInput = (EditText)findViewById(R.id.usernameText);
        passwordInput = (EditText)findViewById(R.id.passwordText);
        register = (TextView)findViewById(R.id.registerView);
        login = (Button)findViewById(R.id.loginButton);

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(final View view) {
                StringRequest loginRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/login",
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String token) {
                                Intent goToMainScreen = new Intent(view.getContext(), MainScreen.class);
                                goToMainScreen.putExtra("waremasterToken", token);
                                startActivity(goToMainScreen);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        int httpStatusCode = error.networkResponse.statusCode;
                        if(httpStatusCode == 404)
                            Toast.makeText(getApplicationContext(), "Korisnik s navedenim podacima nije pronađen.", Toast.LENGTH_LONG).show();
                        else if(httpStatusCode == 401)
                            Toast.makeText(getApplicationContext(), "Neispravna lozinka.", Toast.LENGTH_LONG).show();
                        else
                            Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }){@Override
                public Map<String, String> getParams(){
                    Map<String, String> params = new HashMap<>();
                    params.put("username", usernameInput.getText().toString());
                    params.put("password", passwordInput.getText().toString());
                    return params;
                }
                };
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(loginRequest);
            }
        });

        register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent registerIntent = new Intent(view.getContext(), Register.class);
                startActivity(registerIntent);
            }
        });
    }
}
