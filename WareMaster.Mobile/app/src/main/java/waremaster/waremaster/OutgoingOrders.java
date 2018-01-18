package waremaster.waremaster;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.auth0.android.jwt.JWT;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OutgoingOrders extends AppCompatActivity {

    private ListView productsWithInputsList;
    private Button saveOutgoingOrder;
    private String token;
    private int companyId;
    private String orderId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_outgoing_orders);

        productsWithInputsList = (ListView)findViewById(R.id.productsWithNumberInputsListView);
        saveOutgoingOrder = (Button)findViewById(R.id.saveOutgoingOrderButton);

        token = getIntent().getStringExtra("waremasterToken");
        companyId = Integer.parseInt(new JWT(token).getClaim("companyid").asString());
        orderId = getIntent().getStringExtra("orderid");

        JsonObjectRequest getOrderRequest = new JsonObjectRequest(Request.Method.GET, getString(R.string.base_url) + "/orders/details?companyId="
                + companyId + "&id=" + orderId, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject order) {
                        JSONArray productOrders = order.optJSONArray("ProductOrders");
                        ArrayList<String> listContents = new ArrayList<String>(productOrders.length());
                        for (int i = 0; i < productOrders.length(); i++)
                        {
                            JSONObject productOrder = productOrders.optJSONObject(i);
                            JSONObject product = productOrder.optJSONObject("Product");
                            listContents.add(product.optString("Name") + " Količina: " + productOrder.optInt("ProductQuantity"));
                        }
                        OutgoingProductsListAdapter adapter = new OutgoingProductsListAdapter(listContents, getApplicationContext());
                        productsWithInputsList.setAdapter(adapter);
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
        RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(getOrderRequest);
    }
}
