package waremaster.waremaster;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.auth0.android.jwt.JWT;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OutgoingOrdersDetails extends AppCompatActivity {

    private ListView productsList;
    private Button startWorkOnOutgoing;
    private String token;
    private JSONObject order;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_outgoing_orders_details);

        productsList = (ListView)findViewById(R.id.outgoingOrderProductsListView);
        startWorkOnOutgoing = (Button)findViewById(R.id.startWorkOnOutgoingButton);

        token = getIntent().getStringExtra("waremasterToken");
        try {
            order = new JSONObject(getIntent().getStringExtra("order"));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JSONArray productOrders = order.optJSONArray("ProductOrders");
        List<String> listContents = new ArrayList<String>(productOrders.length());
        for (int i = 0; i < productOrders.length(); i++)
        {
            JSONObject productOrder = productOrders.optJSONObject(i);
            JSONObject product = productOrder.optJSONObject("Product");
            listContents.add(product.optString("Name") + " Količina: " + productOrder.optInt("ProductQuantity"));
        }
        productsList.setAdapter(new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, listContents));

        startWorkOnOutgoing.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(final View view) {
                    JSONArray productOrders = order.optJSONArray("ProductOrders");
                    JSONArray newProductOrders = new JSONArray();
                    for(int i=0; i<productOrders.length(); i++)
                    {
                        JSONObject productOrder = productOrders.optJSONObject(i);
                        JSONObject newProductOrder = new JSONObject();
                        try {
                            newProductOrder.put("ProductId", productOrder.optString("ProductId"));
                            newProductOrder.put("OrderId", productOrder.optString("OrderId"));
                            newProductOrder.put("ProductQuantity", productOrder.optString("ProductQuantity"));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        newProductOrders.put(newProductOrder);
                    }
                    try {
                        order.put("Status", 1);
                        order.put("ProductOrders", newProductOrders);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    StringRequest startWorkingOnOrderRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/orders/edit",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String orderResponse) {
                                    Intent goWorkOnOrder = new Intent(view.getContext(), OutgoingOrders.class);
                                    goWorkOnOrder.putExtra("waremasterToken", token);
                                    goWorkOnOrder.putExtra("orderid", order.optString("Id"));
                                    startActivity(goWorkOnOrder);
                                }
                            }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.networkResponse.statusCode + error.toString(), Toast.LENGTH_LONG).show();
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
                            return order.toString().getBytes();
                        }
                        @Override
                        public String getBodyContentType() {
                            return "application/json";
                        }
                    };
                    RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(startWorkingOnOrderRequest);
                }
        });
    }
}
