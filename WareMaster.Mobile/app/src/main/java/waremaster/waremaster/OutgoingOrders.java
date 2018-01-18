package waremaster.waremaster;

import android.Manifest;
import android.app.LauncherActivity;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
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
    private Button saveOutgoingOrder, scanProduct;
    private String token;
    private int companyId;
    private String orderId;
    private JSONArray productOrders;
    private OutgoingProductsListAdapter adapter;
    private JSONObject takenProducts;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_outgoing_orders);

        productsWithInputsList = (ListView)findViewById(R.id.productsWithNumberInputsListView);
        saveOutgoingOrder = (Button)findViewById(R.id.saveOutgoingOrderButton);
        scanProduct = (Button)findViewById(R.id.scanOutgoingProductButton);

        token = getIntent().getStringExtra("waremasterToken");
        companyId = Integer.parseInt(new JWT(token).getClaim("companyid").asString());
        orderId = getIntent().getStringExtra("orderid");

        takenProducts = new JSONObject();

        JsonObjectRequest getOrderRequest = new JsonObjectRequest(Request.Method.GET, getString(R.string.base_url) + "/orders/details?companyId="
                + companyId + "&id=" + orderId, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject order) {
                        productOrders = order.optJSONArray("ProductOrders");
                        ArrayList<String> listContents = new ArrayList<String>(productOrders.length());
                        for (int i = 0; i < productOrders.length(); i++)
                        {
                            JSONObject productOrder = productOrders.optJSONObject(i);
                            JSONObject product = productOrder.optJSONObject("Product");
                            listContents.add(product.optString("Name") + " Količina: " + productOrder.optInt("ProductQuantity"));
                        }
                        adapter = new OutgoingProductsListAdapter(listContents, getApplicationContext());
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

        scanProduct.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (ContextCompat.checkSelfPermission(OutgoingOrders.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
                    ActivityCompat.requestPermissions(OutgoingOrders.this, new String[]{Manifest.permission.CAMERA}, 0);
                else
                    scanNow(view);
            }
        });
    }

    public void scanNow(View view){
        IntentIntegrator integrator = new IntentIntegrator(OutgoingOrders.this);
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
                String scannedBarcode = scanningResult.getContents();
                for (int i = 0; i < productOrders.length(); i++)
                {
                    JSONObject productOrder = productOrders.optJSONObject(i);
                    final JSONObject product = productOrder.optJSONObject("Product");
                    if(product.optString("Barcode").equals(scannedBarcode))
                    {
                       EditText listRow = getViewByPosition(i, productsWithInputsList).findViewById(R.id.numberOfTakenEditText);
                       String listRowText = listRow.getText().toString();
                       int takenQuantity;
                       if(TextUtils.isEmpty(listRowText))
                           takenQuantity = 0;
                       else
                           takenQuantity = Integer.parseInt(listRowText);
                       if(takenQuantity <= productOrder.optInt("ProductQuantity") && takenQuantity >= 0)
                       {
                           try {
                               takenProducts.put(product.optString("Id"), takenQuantity);
                           } catch (JSONException e) {
                               e.printStackTrace();
                           }
                       }
                       else
                           Toast.makeText(getApplicationContext(), "Ne možete uzeti više od tražene količine niti manje od 0.", Toast.LENGTH_LONG).show();
                        break;
                    }
                }
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
            scanNow(findViewById(R.id.scanOutgoingProductButton));
        else
            Toast.makeText(getApplicationContext(), "Skener ne može raditi bez pristupa kameri!", Toast.LENGTH_LONG).show();
        return;
    }

    public View getViewByPosition(int pos, ListView listView) {
        final int firstListItemPosition = listView.getFirstVisiblePosition();
        final int lastListItemPosition = firstListItemPosition + listView.getChildCount() - 1;

        if (pos < firstListItemPosition || pos > lastListItemPosition ) {
            return listView.getAdapter().getView(pos, null, listView);
        } else {
            final int childIndex = pos - firstListItemPosition;
            return listView.getChildAt(childIndex);
        }
    }
}
