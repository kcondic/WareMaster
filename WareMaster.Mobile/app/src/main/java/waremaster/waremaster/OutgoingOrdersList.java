package waremaster.waremaster;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.auth0.android.jwt.JWT;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OutgoingOrdersList extends AppCompatActivity {

    private ListView outgoingOrdersList;
    private TextView noOrdersView;
    private String token;
    private int employeeId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_outgoing_orders_list);

        outgoingOrdersList = (ListView)findViewById(R.id.outgoingOrdersListView);
        noOrdersView = (TextView)findViewById(R.id.outgoingOrderDetailsNoOrdersView);

        token = getIntent().getStringExtra("waremasterToken");
        employeeId = Integer.parseInt(new JWT(token).getClaim("id").asString());

        JsonArrayRequest getAssignedOrdersRequest = new JsonArrayRequest(Request.Method.GET, getString(R.string.base_url) + "/orders/assigned?employeeId="
                + employeeId, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(final JSONArray assignedOrders) {
                        List<String> listContents = new ArrayList<String>(assignedOrders.length());
                        for (int i = 0; i < assignedOrders.length(); i++)
                        {
                            JSONObject assignedOrder = assignedOrders.optJSONObject(i);
                            if(assignedOrder.optString("Status").equals("0"))
                                listContents.add("Planirana: " + assignedOrder.optString("TimeOfCreation"));
                            if(assignedOrder.optString("Status").equals("1"))
                                listContents.add("U tijeku: " + assignedOrder.optString("TimeOfCreation"));
                        }
                        outgoingOrdersList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                                JSONObject order = assignedOrders.optJSONObject(i);
                                if(order.optString("Status").equals("1"))
                                {
                                    Intent goWorkOnOrder = new Intent(view.getContext(), OutgoingOrders.class);
                                    goWorkOnOrder.putExtra("waremasterToken", token);
                                    goWorkOnOrder.putExtra("orderid", order.optString("Id"));
                                    startActivity(goWorkOnOrder);
                                }
                                else
                                {
                                    Intent goToOrderDetails = new Intent(view.getContext(), OutgoingOrdersDetails.class);
                                    goToOrderDetails.putExtra("waremasterToken", token);
                                    goToOrderDetails.putExtra("order", assignedOrders.optJSONObject(i).toString());
                                    startActivity(goToOrderDetails);
                                }
                            }
                        });
                        outgoingOrdersList.setAdapter(new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, listContents));
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                if(error.networkResponse.statusCode == 403)
                    noOrdersView.setVisibility(View.VISIBLE);
                else
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
        RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(getAssignedOrdersRequest);
    }
}
