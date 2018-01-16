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
import android.widget.TextView;
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

public class IncomingOrders extends AppCompatActivity {

    private Button scanOrder, saveOrder;
    private ListView productsList;
    private EditText note;
    private JSONObject orderObject;
    private String token;
    private int companyId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incoming_orders);

        scanOrder = (Button)findViewById(R.id.scanIncomingOrderButton);
        saveOrder = (Button)findViewById(R.id.saveIncomingOrderButton);
        productsList = (ListView)findViewById(R.id.incomingProductsList);
        note = (EditText) findViewById(R.id.incomingNoteText);

        saveOrder.setEnabled(false);
        token = getIntent().getStringExtra("waremasterToken");
        companyId = Integer.parseInt(new JWT(token).getClaim("companyid").asString());

        scanOrder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (ContextCompat.checkSelfPermission(IncomingOrders.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
                    ActivityCompat.requestPermissions(IncomingOrders.this, new String[]{Manifest.permission.CAMERA}, 0);
                else
                    scanNow(view);
            }
        });

        saveOrder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    orderObject.put("Status", "2");
                    orderObject.put("Note", note.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                StringRequest editOrderRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/orders/edit",
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String order) {
                                note.setText("");
                                productsList.setAdapter(null);
                                saveOrder.setEnabled(false);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
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
                        return orderObject.toString().getBytes();
                    }
                    @Override
                    public String getBodyContentType() {
                        return "application/json";
                    }
                };
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(editOrderRequest);
            }
        });
    }

    public void scanNow(View view){
        IntentIntegrator integrator = new IntentIntegrator(IncomingOrders.this);
        integrator.setCaptureActivity(AnyOrientationCaptureActivity.class);
        integrator.setOrientationLocked(false);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.ONE_D_CODE_TYPES);
        integrator.setPrompt(getString(R.string.scan_bar_code));
        integrator.setCameraId(0);
        integrator.setBarcodeImageEnabled(true);
        integrator.initiateScan();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        IntentResult scanningResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, intent);

        if (scanningResult != null)
        {
            if(scanningResult.getContents() != null)
            {
                String orderId = scanningResult.getContents();
                orderId = orderId.replaceFirst("^0+(?!$)", "");
                JsonObjectRequest getOrderRequest = new JsonObjectRequest(Request.Method.GET, getString(R.string.base_url) + "/orders/details?companyId="
                        + companyId + "&id=" + orderId, null,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject order) {
                                {
                                    if(order.optString("Type").equals("1") || order.optString("Status").equals("2"))
                                    {
                                        Toast.makeText(getApplicationContext(),"Narudžba nije dostupna za obradu.", Toast.LENGTH_LONG).show();
                                        return;
                                    }
                                    orderObject = order;
                                    JSONArray productOrders = order.optJSONArray("ProductOrders");
                                    List<String> listContents = new ArrayList<String>(productOrders.length());
                                    for (int i = 0; i < productOrders.length(); i++)
                                    {
                                        JSONObject productOrder = productOrders.optJSONObject(i);
                                        JSONObject product = productOrder.optJSONObject("Product");
                                        listContents.add(product.optString("Name") + " Količina: " + productOrder.optInt("ProductQuantity"));
                                    }
                                    productsList.setAdapter(new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, listContents));
                                    saveOrder.setEnabled(true);
                                }
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        int httpStatusCode = error.networkResponse.statusCode;
                        if(httpStatusCode == 401 || httpStatusCode == 400)
                            Toast.makeText(getApplicationContext(), "Narudžba s tim barkodom ne postoji.", Toast.LENGTH_LONG).show();
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
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(getOrderRequest);
            }
            else
                Toast.makeText(this, "Otkazano", Toast.LENGTH_LONG).show();
        }
        else
            Toast.makeText(getApplicationContext(),"Nisu dobiveni podaci o skeniranju.", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED)
            scanNow(findViewById(R.id.scanButton));
        else
            Toast.makeText(getApplicationContext(), "Skener ne može raditi bez pristupa kameri!", Toast.LENGTH_LONG).show();
        return;
    }
}
