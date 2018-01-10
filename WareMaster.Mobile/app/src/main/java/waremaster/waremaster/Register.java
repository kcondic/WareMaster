package waremaster.waremaster;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import java.util.HashMap;
import java.util.Map;

public class Register extends AppCompatActivity {
    private EditText accessStringInput, registerUsernameInput, registerPasswordInput;
    private Button register;
    private TextView usernameTaken;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        accessStringInput = (EditText)findViewById(R.id.accessStringText);
        registerUsernameInput = (EditText)findViewById(R.id.registerUsernameText);
        registerPasswordInput = (EditText)findViewById(R.id.registerPasswordText);
        register = (Button)findViewById(R.id.registerButton);
        usernameTaken = (TextView)findViewById(R.id.usernameTakenView);

        registerUsernameInput.setOnFocusChangeListener(new View.OnFocusChangeListener() {
               @Override
               public void onFocusChange(View view, boolean hasFocus) {
                   if (!hasFocus) {
                       StringRequest registerRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/register",
                               new Response.Listener<String>() {
                                   @Override
                                   public void onResponse(String doesUsernameExist) {
                                       if (doesUsernameExist.equals("true")) {
                                           usernameTaken.setVisibility(View.VISIBLE);
                                           register.setEnabled(false);
                                       } else {
                                           usernameTaken.setVisibility(View.INVISIBLE);
                                           register.setEnabled(true);
                                       }
                                   }
                               }, new Response.ErrorListener() {
                           @Override
                           public void onErrorResponse(VolleyError error) {
                               Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
                           }
                       }) {
                           @Override
                           public Map<String, String> getParams() {
                               Map<String, String> params = new HashMap<>();
                               params.put("username", registerUsernameInput.getText().toString());
                               return params;
                           }
                       };
                       RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(registerRequest);
                   }
               }
           });

        register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(final View view) {
                StringRequest registerRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/register",
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                Intent returnToLogin = new Intent(view.getContext(), LogIn.class);
                                startActivity(returnToLogin);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        int httpStatusCode = error.networkResponse.statusCode;
                        if(httpStatusCode == 404)
                            Toast.makeText(getApplicationContext(), "Korisnik ne postoji. Administrator Vas mora dodati prije registracije.", Toast.LENGTH_LONG).show();
                        else if(httpStatusCode == 401)
                            Toast.makeText(getApplicationContext(), "Korisničko ime mora započinjati sa slovom i sastojati se od najmanje 3 znaka (engleska mala slova i brojevi)," +
                                    "Lozinka mora sadržavati najmanje 6 znakova (engleska mala ili velika slova i brojevi)", Toast.LENGTH_LONG).show();
                        else
                            Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }){@Override
                public Map<String, String> getParams(){
                    Map<String, String> params = new HashMap<>();
                    params.put("accessString", accessStringInput.getText().toString());
                    params.put("usernameToRegister", registerUsernameInput.getText().toString());
                    params.put("passwordToRegister", registerPasswordInput.getText().toString());
                    return params;
                }
                };
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(registerRequest);
            }
        });
    }
}
