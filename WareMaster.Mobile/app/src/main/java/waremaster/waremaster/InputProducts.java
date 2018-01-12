package waremaster.waremaster;

import android.content.Intent;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.google.gson.Gson;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.journeyapps.barcodescanner.CaptureActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class InputProducts extends AppCompatActivity {

    private Button addNewProduct, scanProduct, saveChanges;
    private EditText barcode, quantity;
    private JSONObject productObject;
    private String token;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_input_products);

        addNewProduct = (Button)findViewById(R.id.addNewProductButton);
        scanProduct = (Button)findViewById(R.id.scanButton);
        saveChanges = (Button)findViewById(R.id.saveButton);
        barcode = (EditText)findViewById(R.id.barcodeEditText);
        quantity = (EditText)findViewById(R.id.quantityEditText);

        saveChanges.setEnabled(false);

        token = getIntent().getStringExtra("waremasterToken");

        barcode.setText(token);

        scanProduct.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                scanNow(view);
            }
        });

        saveChanges.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    productObject.put("Barcode", barcode.getText().toString());
                    productObject.put("Counter", Integer.parseInt(quantity.getText().toString()));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                StringRequest editProductRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/products/edit",
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String product) {
                                barcode.setText("");
                                quantity.setText("");
                                saveChanges.setEnabled(false);
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
                        return productObject.toString().getBytes();
                    }
                    @Override
                    public String getBodyContentType() {
                        return "application/json";
                    }
                };
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(editProductRequest);
            }
        });

    }

    public void scanNow(View view){
        IntentIntegrator integrator = new IntentIntegrator(InputProducts.this);
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
                JsonObjectRequest getProductRequest = new JsonObjectRequest(Request.Method.GET, getString(R.string.base_url) + "/products/get?barcode="
                        + scanningResult.getContents(), null,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject product) {
                                if(product == null)
                                    Toast.makeText(getApplicationContext(), "Ne postoji proizvod s tim barkodom.", Toast.LENGTH_LONG).show();
                                else
                                {
                                    productObject = product;
                                    barcode.setText(product.optString("Barcode"));
                                    quantity.setText(product.optString("Counter"));
                                    saveChanges.setEnabled(true);
                                }
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
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(getProductRequest);
            }
            else
                Toast.makeText(this, "Otkazano", Toast.LENGTH_LONG).show();
        }
        else
            Toast.makeText(getApplicationContext(),"Nisu dobiveni podaci o skeniranju.", Toast.LENGTH_SHORT).show();
    }
}